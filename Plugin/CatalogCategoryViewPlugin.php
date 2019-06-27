<?php

namespace Incipio\LayeredNav\Plugin;

class CatalogCategoryViewPlugin
{
	protected $resultJsonFactory;

	public function __construct(
		\Magento\Framework\Controller\Result\JsonFactory $resultJsonFactory
	)
	{
		$this->resultJsonFactory = $resultJsonFactory;
	}

	public function afterExecute(\Magento\Catalog\Controller\Category\View $subject, $result){
		if ($result && $subject->getRequest()->getQuery()->get('isAjax')){
			//set isAjax param to null
			$subject->getRequest()->getQuery()->set('isAjax', null);

			//get blocks
			$product = $result->getLayout()->getBlock('category.products')->toHtml();
			$left = $result->getLayout()->getBlock('catalog.leftnav')->toHtml();

			return $this->resultJsonFactory->create()->setData(['success' => true, 'html' => ['product' => utf8_encode($product), 'left' => utf8_encode($left)]]);
		}
		return $result;		
	}
}